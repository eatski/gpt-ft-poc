import React, { useState } from 'react';

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const openai = (await import("@/lib/openapi")).openai
      const upload = await openai.createFile(file,"fine-tune")
      const filename = upload.data.id;
      const tune = await openai.createFineTune({
        training_file: filename,
        model: "davinci",
      })
      alert(tune.data.id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <>
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    </>
    
  );
}
