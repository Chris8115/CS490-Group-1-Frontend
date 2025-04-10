import { useDropzone } from 'react-dropzone';
import { Container, Alert } from 'react-bootstrap';
import '../css/custom.css';
import uploadIcon from '../assets/upload.png';

function FileDropbox() {
    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
    accept: {'image/*': ['.jpeg', '.png', '.gif']}, // Optional: restrict file types
    multiple: true // Optional: allow multiple files
    });

    const filesList = acceptedFiles.map(file => (
    <li key={file.path}>
        {file.path} - {file.size} bytes
    </li>
    ));

    return (
        <Container className='dropbox'>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop some files here, or click to select files</p>
            }
            </div>
            {filesList.length > 0 && (
            <Alert variant="info" className="mt-3">
                <h4>Files</h4>
                <ul>{filesList}</ul>
            </Alert>
            )}

            <img src={uploadIcon}></img>
        </Container>
    );
}

export default FileDropbox;