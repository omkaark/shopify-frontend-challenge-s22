import styles from "./styles.module.css";
import { useState } from "react";
import ResponseItem from "./Components/ResponseItem";
require("dotenv").config();

export default function App() {
  const [responses, setResponses] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [chosenEngine, setChosenEngine] = useState("text-curie-001");
  const [chosenPreset, setChosenPreset] = useState("Choose one");

  const fetchResult = async () => {
    const raw = JSON.stringify({
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_SECRET}`
      },
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `https://api.openai.com/v1/engines/${chosenEngine}/completions`,
      requestOptions
    );

    const { choices } = await response.json();

    setResponses((responses) => [
      { prompt: prompt, response: choices[0].text.replaceAll("\n\n", " ") },
      ...responses
    ]);
  };

  const engineOptions = ["text-curie-001", "text-babbage-001"];
  const presetOptions = [
    {
      optionName: "preset-joke",
      value: "Tell me a joke about Shopify"
    },
    {
      optionName: "preset-fun",
      value: "Write a poem about a dinosaur in the snow"
    },
    {
      optionName: "preset-serious",
      value: "Why should shopify hire me?"
    },
    {
      optionName: "preset-happy",
      value: "Tell me something to make me happy"
    }
  ];

  return (
    <div className={styles.App}>
      <h1>Fun with AI</h1>
      <label>Select your preferred engine:</label>
      <select
        name="engines"
        value={chosenEngine}
        onChange={(e) => {
          setChosenEngine(e.target.value);
        }}
      >
        {engineOptions.map((val) => (
          <option value={val}>{val}</option>
        ))}
      </select>
      <label>Select a preset:</label>
      <select
        name="presets"
        value={chosenPreset}
        onChange={(e) => {
          setChosenPreset(e.target.value);
          setPrompt(
            presetOptions.find((i) => i.optionName === e.target.value).value
          );
        }}
      >
        <option disabled selected value="Choose one">
          Choose one
        </option>
        {presetOptions.map((val) => (
          <option value={val.optionName}>{val.optionName}</option>
        ))}
      </select>
      <h5>Enter prompt</h5>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <button onClick={fetchResult}>Submit</button>
      <div className={styles.responsesContainer}>
        {responses.map((resp, idx) => (
          <ResponseItem
            key={idx}
            prompt={resp.prompt}
            response={resp.response}
          />
        ))}
      </div>
    </div>
  );
}
