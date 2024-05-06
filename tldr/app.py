from flask import Flask, request, jsonify
import boto3
import os
from urllib.parse import urlparse, unquote
import logging
from dotenv import load_dotenv
import time
from openai import OpenAI
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

load_dotenv()

# Configure AWS
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

textract = boto3.client(
    'textract',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

openai_client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)


@app.route('/tldr', methods=['GET'])
def process_and_summarize():
    s3_url = request.args.get('fileUrl')
    if not s3_url:
        return jsonify({"error": "No S3 URL provided"}), 400

    parsed_url = urlparse(s3_url)
    bucket_name = parsed_url.netloc.split('.')[0]
    file_key = unquote(parsed_url.path.lstrip('/'))

    try:
       
        text_content = ""
        if file_key.lower().endswith('.pdf'):
            text_content = extract_text_from_pdf(bucket_name, file_key)
        elif file_key.lower().endswith('.docx'):
            text_content = extract_text_from_docx(bucket_name, file_key)
        else:
            return jsonify({"error": "Unsupported file type"}), 400

      
        return summarize_text(text_content)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def extract_text_from_pdf(bucket_name, file_key):
    response = textract.start_document_text_detection(
        DocumentLocation={'S3Object': {
            'Bucket': bucket_name, 'Name': file_key}}
    )
    job_id = response['JobId']
    text_content = []
    while True:
        response = textract.get_document_text_detection(JobId=job_id)
        if response['JobStatus'] == 'SUCCEEDED':
            for item in response.get('Blocks', []):
                if item['BlockType'] == 'LINE':
                    text_content.append(item['Text'])
            break
        elif response['JobStatus'] == 'FAILED':
            raise Exception("Text detection failed")
        time.sleep(5)
    return " ".join(text_content)


def extract_text_from_docx(bucket_name, file_key):
    response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
    file_stream = io.BytesIO(response['Body'].read())

    from docx import Document
    doc = Document(file_stream)
    return " ".join([para.text for para in doc.paragraphs])


def summarize_text(text):
    thread = openai_client.beta.threads.create(
        messages=[
            {
                "role": "user",
                "content": text,
            }
        ]
    )
    run = openai_client.beta.threads.runs.create(
        thread_id=thread.id, assistant_id=os.getenv('OPENAI_ASSISTANT_ID')
    )
    while run.status != "completed":
        run = openai_client.beta.threads.runs.retrieve(
            thread_id=thread.id, run_id=run.id)
        time.sleep(1)
    message_response = openai_client.beta.threads.messages.list(
        thread_id=thread.id)
    messages = message_response.data
    latest_message = messages[0]
    return jsonify({"summary": latest_message.content[0].text.value})


if __name__ == '__main__':
    app.run(debug=True)
