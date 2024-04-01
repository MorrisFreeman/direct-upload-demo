import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/v1/articles');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files', error);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [])

  const handleViaServerChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleViaServerSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('article[article]', file);

    try {
      const response = await axios.post('http://localhost:3001/api/v1/articles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully', response.data);
      await fetchFiles();
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const handleDirectChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleDirectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      return;
    }

    // 署名付きURLを取得
    const presignResponse = await axios.get('http://localhost:3001/s3/params', {
      params: {filename: file.name, contentType: file.type},
    });

    const {url, fields} = presignResponse.data;

    console.log('Presign response:', JSON.stringify(presignResponse.data));
    
    // FormDataを作成し、S3の署名付きURLに直接アップロード
    const formData = new FormData();

    Object.entries({...fields, file}).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const uploadResponse = await axios.post(url, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });


    const id_without_prefix = fields.key.replace(/^cache\//, '')
    console.log(id_without_prefix);
    await axios.post('http://localhost:3001/api/v1/articles/create_with_direct_upload', {
      article: {
        // アップロードしたファイルのキーなど、ファイルに関する情報をJSON文字列として含める
        article_data: JSON.stringify({
          id: id_without_prefix, // S3の署名付きURLで取得したキー
          storage: 'cache', // ファイルが保存されているストレージのタイプ
          metadata: { // ファイルに関するメタデータ
            filename: file.name,
            size: file.size,
            mime_type: file.type
          }
        })
      }
    });

    await fetchFiles();
    console.log('File uploaded:', uploadResponse);
  };

  return (
    <>
      <h1>File Upload</h1>
      <div>
        <h2>Upload via server</h2>
        <form onSubmit={handleViaServerSubmit}>
          <input type="file" onChange={handleViaServerChange} />
          <button type="submit">Upload File</button>
        </form>
      </div>
      <div>
        <h2>Upload direct</h2>
        <form onSubmit={handleDirectSubmit}>
          <input type="file" onChange={handleDirectChange} />
          <button type="submit">Upload</button>
        </form>
      </div>
      <div>
        {files.map((file: any) => {
            if (file.mime_type === 'video/mp4') {
              return (
              <div key={file.id}>
                <video controls style={{ height: '300px' }}>
                  <source src={file.url} type='video/mp4' />
                </video>
              </div>
              )
            } else {
              return (
              <div key={file.id}>
                <img src={file.url} style={{ height: '300px' }} alt='' />
              </div>
              )
            }
          })}
      </div>
    </>
  );
};

export default FileUpload;
