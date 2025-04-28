
import streamlit as st
import os
import tempfile
from typing import List, Dict, Any
import fitz  # PyMuPDF
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM

# Set page config
st.set_page_config(
    page_title="Local Offline PDF Chatbot",
    page_icon="📚",
    layout="wide"
)

# Initialize session state
if "documents" not in st.session_state:
    st.session_state.documents = []
if "messages" not in st.session_state:
    st.session_state.messages = []
if "embeddings" not in st.session_state:
    st.session_state.embeddings = None
if "embedding_model" not in st.session_state:
    st.session_state.embedding_model = None
if "llm_model" not in st.session_state:
    st.session_state.llm_model = None
if "llm_tokenizer" not in st.session_state:
    st.session_state.llm_tokenizer = None

# Create directory structure if it doesn't exist
for dir_path in ["models", "pdfs", "db"]:
    os.makedirs(dir_path, exist_ok=True)

# PDF processing utilities
def extract_text_from_pdf(pdf_file) -> Dict[int, str]:
    """
    Extract text from a PDF file using PyMuPDF.
    Returns a dictionary mapping page numbers to page text.
    """
    text_by_page = {}
    
    # Save the uploaded file to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(pdf_file.getvalue())
        tmp_path = tmp_file.name
    
    try:
        # Open the PDF with PyMuPDF
        doc = fitz.open(tmp_path)
        for page_num, page in enumerate(doc):
            text = page.get_text()
            text_by_page[page_num] = text
        doc.close()
    finally:
        # Clean up the temporary file
        os.unlink(tmp_path)
    
    return text_by_page

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """
    Split text into overlapping chunks of approximately chunk_size characters.
    """
    chunks = []
    if len(text) <= chunk_size:
        chunks.append(text)
    else:
        start = 0
        while start < len(text):
            end = start + chunk_size
            # If we're not at the end of the text, try to find a period or newline to break on
            if end < len(text):
                # Look for a good breakpoint
                breakpoint = text.rfind(". ", start + chunk_size - 200, start + chunk_size)
                if breakpoint != -1:
                    end = breakpoint + 1
            
            chunks.append(text[start:end])
            start = end - overlap
    return chunks

def load_embedding_model():
    """
    Load the sentence transformer model for embeddings.
    """
    with st.spinner("Loading embedding model..."):
        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model

def create_embeddings(chunks: List[str]):
    """
    Create embeddings for text chunks and store in FAISS index.
    """
    if st.session_state.embedding_model is None:
        st.session_state.embedding_model = load_embedding_model()
    
    model = st.session_state.embedding_model
    embeddings = model.encode(chunks)
    
    # Normalize embeddings for cosine similarity
    faiss.normalize_L2(embeddings)
    
    # Create a FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)
    index.add(embeddings)
    
    return index, embeddings

def load_llm_model(model_path: str):
    """
    Load a local LLM model from the given path.
    """
    try:
        with st.spinner(f"Loading model from {model_path}..."):
            tokenizer = AutoTokenizer.from_pretrained(model_path)
            model = AutoModelForCausalLM.from_pretrained(
                model_path, 
                device_map="auto",
                load_in_8bit=True  # For memory efficiency
            )
        return model, tokenizer
    except Exception as e:
        st.error(f"Error loading model: {str(e)}")
        return None, None

def generate_response(query: str, context: str, temperature: float = 0.7, max_tokens: int = 512):
    """
    Generate a response to a query using the loaded LLM model and context.
    """
    if not st.session_state.llm_model or not st.session_state.llm_tokenizer:
        st.error("No LLM model loaded. Please load a model first.")
        return "Error: No model loaded"
    
    model = st.session_state.llm_model
    tokenizer = st.session_state.llm_tokenizer
    
    # Create the prompt with context
    prompt = f"""Answer the question based on the following context:

Context:
{context}

Question:
{query}

Answer:"""
    
    try:
        # Tokenize and generate
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        with st.spinner("Generating response..."):
            outputs = model.generate(
                inputs.input_ids,
                max_new_tokens=max_tokens,
                temperature=temperature,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        response = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
        return response.strip()
    except Exception as e:
        st.error(f"Error generating response: {str(e)}")
        return f"Error generating response: {str(e)}"

def search_similar_chunks(query: str, top_k: int = 5):
    """
    Search for the most similar chunks to the query.
    """
    if st.session_state.embedding_model is None:
        st.error("Embedding model not loaded.")
        return []
    
    if not hasattr(st.session_state, 'index') or not hasattr(st.session_state, 'chunks'):
        st.error("No documents have been processed yet.")
        return []
    
    # Encode the query
    query_embedding = st.session_state.embedding_model.encode([query])
    faiss.normalize_L2(query_embedding)
    
    # Search the index
    D, I = st.session_state.index.search(query_embedding, top_k)
    
    results = []
    for i, idx in enumerate(I[0]):
        if idx < len(st.session_state.chunks):
            results.append({
                "chunk": st.session_state.chunks[idx],
                "score": float(D[0][i])
            })
    
    return results

# Sidebar UI
st.sidebar.title("Local Offline PDF Chatbot")

# Upload PDFs
uploaded_files = st.sidebar.file_uploader(
    "Upload PDF Documents", 
    type=["pdf"], 
    accept_multiple_files=True
)

if uploaded_files:
    for uploaded_file in uploaded_files:
        # Check if this file was already processed (by name)
        file_names = [doc["name"] for doc in st.session_state.documents]
        if uploaded_file.name not in file_names:
            with st.spinner(f"Processing {uploaded_file.name}..."):
                # Extract text from PDF
                pages = extract_text_from_pdf(uploaded_file)
                
                # Combine all pages and chunk the text
                all_text = " ".join([text for _, text in sorted(pages.items())])
                chunks = chunk_text(all_text)
                
                # Store document info
                st.session_state.documents.append({
                    "name": uploaded_file.name,
                    "pages": len(pages),
                    "chunks": chunks
                })
    
    # Process embeddings for all documents
    all_chunks = []
    for doc in st.session_state.documents:
        all_chunks.extend(doc["chunks"])
    
    # Store the chunks for later retrieval
    st.session_state.chunks = all_chunks
    
    # Create embeddings and FAISS index
    with st.spinner("Creating embeddings for documents..."):
        index, embeddings = create_embeddings(all_chunks)
        st.session_state.index = index
        st.session_state.embeddings = embeddings
        
    st.sidebar.success(f"Processed {len(st.session_state.documents)} documents with {len(all_chunks)} chunks")

# Model selection
st.sidebar.subheader("LLM Model")
model_path = st.sidebar.text_input(
    "Enter path to local model", 
    value="./models/mistral-7b-instruct"
)

if st.sidebar.button("Load Model"):
    model, tokenizer = load_llm_model(model_path)
    if model and tokenizer:
        st.session_state.llm_model = model
        st.session_state.llm_tokenizer = tokenizer
        st.sidebar.success(f"Model loaded from {model_path}")

# Model parameters
st.sidebar.subheader("Parameters")
temperature = st.sidebar.slider("Temperature", 0.0, 1.0, 0.7, 0.1)
max_tokens = st.sidebar.slider("Max Tokens", 64, 2048, 512, 64)

# Analysis mode
st.sidebar.subheader("Analysis Mode")
mode = st.sidebar.radio("Select mode", ["Analyze Single PDF", "Compare PDFs"])

# Main UI
if mode == "Analyze Single PDF":
    st.title("Chat with your PDF documents")
    
    # Display messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.write(message["content"])
    
    # Chat input
    if query := st.chat_input("Ask about your documents..."):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": query})
        with st.chat_message("user"):
            st.write(query)
        
        if not st.session_state.documents:
            with st.chat_message("assistant"):
                st.write("Please upload some PDF documents first.")
            st.session_state.messages.append({"role": "assistant", "content": "Please upload some PDF documents first."})
        elif not st.session_state.llm_model:
            with st.chat_message("assistant"):
                st.write("Please load a model first.")
            st.session_state.messages.append({"role": "assistant", "content": "Please load a model first."})
        else:
            # Search for relevant chunks
            results = search_similar_chunks(query)
            if not results:
                context = "No relevant information found in the documents."
            else:
                # Combine chunks into context
                context = "\n\n".join([r["chunk"] for r in results])
            
            # Generate response
            with st.chat_message("assistant"):
                response = generate_response(query, context, temperature, max_tokens)
                st.write(response)
            
            # Add assistant message
            st.session_state.messages.append({"role": "assistant", "content": response})
    
    # Clear chat button
    if st.button("Clear Chat"):
        st.session_state.messages = []
        st.experimental_rerun()

else:  # Compare PDFs mode
    st.title("Compare PDF Documents")
    
    if len(st.session_state.documents) < 2:
        st.warning("Please upload at least two PDF documents for comparison.")
    else:
        # Document selection
        selected_docs = st.multiselect(
            "Select documents to compare",
            options=[doc["name"] for doc in st.session_state.documents],
            default=[doc["name"] for doc in st.session_state.documents[:2]]
        )
        
        if len(selected_docs) < 2:
            st.warning("Please select at least two documents to compare.")
        else:
            # Get the selected documents
            docs_to_compare = [doc for doc in st.session_state.documents if doc["name"] in selected_docs][:2]
            
            # Display document info in two columns
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader(docs_to_compare[0]["name"])
                st.write(f"Pages: {docs_to_compare[0]['pages']}")
                with st.expander("Sample Content"):
                    st.write(docs_to_compare[0]["chunks"][0][:500] + "...")
            
            with col2:
                st.subheader(docs_to_compare[1]["name"])
                st.write(f"Pages: {docs_to_compare[1]['pages']}")
                with st.expander("Sample Content"):
                    st.write(docs_to_compare[1]["chunks"][0][:500] + "...")
            
            # Compare button
            if st.button("Generate Comparison"):
                with st.spinner("Comparing documents..."):
                    # In a real implementation, we would use the LLM to generate comparisons
                    # This is a simplified simulation
                    
                    st.subheader("Comparison Results")
                    
                    tab1, tab2 = st.tabs(["Similarities", "Differences"])
                    
                    with tab1:
                        st.write("This is a simulated comparison showing similarities between the documents.")
                        st.info("Both documents appear to discuss similar topics and share common themes.")
                        
                    with tab2:
                        st.write("This is a simulated comparison showing differences between the documents.")
                        st.warning(f"{docs_to_compare[0]['name']} focuses more on technical details, while {docs_to_compare[1]['name']} emphasizes practical applications.")

# Add requirements.txt info at the bottom of the sidebar
with st.sidebar.expander("About"):
    st.write("""
    # Local Offline PDF Chatbot
    
    This application allows you to chat with your PDF documents using a local LLM model.
    
    ## Requirements
    ```
    streamlit==1.26.0
    PyMuPDF==1.23.3
    numpy==1.24.3
    faiss-cpu==1.7.4
    sentence-transformers==2.2.2
    transformers==4.33.2
    torch==2.0.1
    ```
    
    ## Running the App
    ```
    pip install -r requirements.txt
    streamlit run app.py
    ```
    """)
