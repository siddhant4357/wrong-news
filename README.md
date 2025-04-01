# Wrong News - AI-Powered Fake News Detection

A web application that uses artificial intelligence to detect and analyze potentially fake news articles.

## Features

- Real-time fake news detection
- Article analysis with confidence scores
- Modern, responsive user interface
- Detailed analysis reports

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Python + FastAPI
- AI/ML: Transformers (Hugging Face)
- Database: SQLite

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter the article text or URL you want to analyze
3. Click "Analyze" to get the results
4. View the detailed analysis and confidence scores

## License

MIT License 