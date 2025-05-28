import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const editorRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    if (onChange) {
      onChange(content);
    }
  };

  // Debug: Check if API key is loaded
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  console.log('TinyMCE API Key loaded:', apiKey ? 'Yes' : 'No');
  console.log('API Key (first 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'Not found');

  return (
    <Editor
      apiKey={apiKey}
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={handleEditorChange}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount',
          'emoticons', 'codesample'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help | link image media | code codesample | emoticons',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder: placeholder,
        branding: false,
        promotion: false,
        setup: (editor) => {
          editor.on('init', () => {
            if (placeholder && !value) {
              editor.setContent(`<p>${placeholder}</p>`);
            }
          });
        },
        // Image upload configuration
        images_upload_url: '/api/upload/image',
        images_upload_base_path: import.meta.env.VITE_BASE_URL || '',
        images_upload_credentials: true,
        images_upload_handler: async (blobInfo, success, failure) => {
          try {
            const formData = new FormData();
            formData.append('image', blobInfo.blob(), blobInfo.filename());

            const response = await fetch('/api/upload/image', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: formData
            });

            if (response.ok) {
              const data = await response.json();
              success(data.url);
            } else {
              failure('Image upload failed');
            }
          } catch (error) {
            failure('Image upload failed: ' + error.message);
          }
        },
        // Link configuration
        link_default_target: '_blank',
        link_assume_external_targets: true,
        // Code sample configuration
        codesample_languages: [
          { text: 'HTML/XML', value: 'markup' },
          { text: 'JavaScript', value: 'javascript' },
          { text: 'CSS', value: 'css' },
          { text: 'PHP', value: 'php' },
          { text: 'Ruby', value: 'ruby' },
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' },
          { text: 'C', value: 'c' },
          { text: 'C#', value: 'csharp' },
          { text: 'C++', value: 'cpp' }
        ]
      }}
    />
  );
};

export default TinyMCEEditor; 