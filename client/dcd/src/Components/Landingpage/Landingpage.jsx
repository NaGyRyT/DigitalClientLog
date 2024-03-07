import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import readmeMd from '../../readme.md';
import remarkGfm from 'remark-gfm'
import './Landingpage.css';

export default function Landingpage() {
  const [readme, setReadme] = useState('');
  
  useEffect(() =>{
    fetch(readmeMd)
      .then((data) => data.text())
      .then((text) => setReadme(text));
  }, [readmeMd]);

  return (
    <>
      <ReactMarkdown className='readme' remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
    </>
  )
}
