import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./facialExpression.css";
import axios from 'axios';

export default function FacialExpression({setsongs}) {
  const videoRef = useRef();
  const [mood, setMood] = useState("");

  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  async function detectMood() {
    const detections = await faceapi
      .detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.3,
        })
      )
      .withFaceExpressions();

    if (!detections || detections.length === 0) {
      setMood("No face detected");
      return;
    }

    let mostProbableExpression = 0;
    let expression = "";

    for (const exp of Object.keys(detections[0].expressions)) {
      if (detections[0].expressions[exp] > mostProbableExpression) {
        mostProbableExpression = detections[0].expressions[exp];
        expression = exp;
      }
    }

    /*
    get http://localhost:3000/songs?mood=happy
    */
    axios.get(`http://localhost:3000/songs?mood=${expression}`)
    .then(response=>{
      console.log(response.data);
      setsongs(response.data.songs);
    })
  }

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  return (
    <div className="mood-element">

      <video
        ref={videoRef}
        autoPlay
        muted
        className= "user-video-feed"
      />

      <br />

      <button onClick={detectMood}>Detect Mood</button>

    </div>
  );
}