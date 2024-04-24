import React, { useRef, useState, useEffect } from "react";
import EmailEditor from "react-email-editor";
import GalleryModal from "./GalleryModal";
import { getPhotoFiles, uploadPhotoFiles, getImageDimensions } from "../lib";
import SendMailModal from "./SendMailModal";
import { MDBBtn } from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import {Link } from "react-router-dom";

const Index = () => {
  const emailEditorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMailModal, setIsOpenMailModal] = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [rawFiles, setRawFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const photosRef = useRef([]);
  const [mailContent, setMailContent] = useState();

  const toggleModal = () => {
    setIsOpen(() => !isOpen);
  };
  const toggleMailModal = () => {
    setIsOpenMailModal(() => !isOpenMailModal);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPhotoFiles();
      photosRef.current = res.data;
      setPhotoFiles(res.data);
    };
    fetchData();
    return () => {};
  }, []);

  let TempDetails=[]
  const localdata=(localStorage.getItem('newsletter'))?localStorage.getItem('newsletter'):[]
  const [temdata, setData] = useState(localdata); 
  const exportHtml = () => {
    debugger
    if (emailEditorRef.current !== null) {
      emailEditorRef?.current?.editor.exportHtml((data) => {
        
        setData(TempDetails => [...TempDetails,  (data.html)])
        if (data.html) {
          const { html } = data;
          const blob = new Blob([html], { type: "text/hbs" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "hello.hbs";
          a.click();
          URL.revokeObjectURL(url);
          // setMailContent(data.html);
          console.log('MailContent', data.html)
          localStorage.setItem("newsletter", JSON.stringify(temdata));
          Swal.fire({
            title: 'Submitted!',
            text: 'You are registered successfully!!',
            icon: 'success',
          },
          setTimeout(() => {
            <Link to='/'></Link>
        }, 2000)
          );
          // toggleMailModal();

        }
      });
    }
  };

  function onReady() {
    // editor is ready
    const editorRef = emailEditorRef.current;
    if (editorRef !== null) {
      editorRef.registerCallback("selectImage", function (_data, done) {
        setIsOpen(true);
        // Open the modal
        done({
          height: 20,
          width: 10,
          size: 400,
          url: "https://cdn.tools.unlayer.com/image/placeholder.png",
        });
      });
    }
  }

  const handleFileInputChange = async (e) => {
    const _files = e.target.files;
    if (_files) {
      const files = Array.from(_files);
      const _results = [];
      for (const file of files) {
        const result = await getImageDimensions(file);
        _results.push(result);
      }
      setRawFiles(_results);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      if (rawFiles.length < 1) return null;
      setLoading(true);
      let i = 0;
      const formData = new FormData();
      for (const item of rawFiles) {
        let file = item.file;
        let width = item.height;
        let height = item.height;
        formData.append(`info_${i}`, JSON.stringify({ width, height }));
        formData.append("mediaFile", file);
        i++;
      }
      const res = await uploadPhotoFiles(formData);
      setLoading(false);
      if (res.error) {
        toggleModal();
        return alert(res.message);
      }
      setRawFiles([]);
      photosRef.current = [...res.data, ...photoFiles];
      setPhotoFiles((prev) => [...res.data, ...prev]);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="export_button">
        <MDBBtn onClick={() => exportHtml()}>Save Template</MDBBtn>
      </div>

      <EmailEditor
        editorId="editor_container"
        ref={emailEditorRef}
        // onLoad={onLoad}
        onReady={onReady}
      />
      <GalleryModal
        isOpen={isOpen}
        photoFiles={photoFiles}
        toggleModal={toggleModal}
        handleFileUpload={handleFileUpload}
        handleFileInputChange={handleFileInputChange}
        rawFiles={rawFiles}
        loading={loading}
      />
      {/* send mail modal */}
      <SendMailModal {...{ toggleMailModal, mailContent, isOpenMailModal }} />
    </div>
  );
};

export default Index;
