import Head from "next/head";
import { useState, useEffect } from "react";
import { hotjar } from "react-hotjar";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import thinking from "assets/img/thinking.png";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackAnalysis, setFeedbackAnalysis] = useState("");
  const [feedbackResponse, setFeedbackResponse] = useState("");

  const handleGenerateFeedbackAnalysis = async () => {
    setLoading(true);
    setFeedbackAnalysis("");
    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_CHATGPT,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt:
            "Podrias darme un analisis corto de este feedback que recibi sobre mi negocio:" +
            feedback,
          temperature: 0,
          max_tokens: 150,
          top_p: 1.0,
          frequency_penalty: 0.2,
          presence_penalty: 0.0,
        }),
      })
        .then((data) => data.json())
        .then((data) => setFeedbackAnalysis(data.choices[0].text));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleGenerateFeedbackResponse = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_CHATGPT,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt:
            "En base al siguiente feedback: " +
            feedback +
            ". Genera una respuesta para el mismo, dependiendo si es positivo o negativo. Si es positivo solamente agradece por el comentario. Si es negativo pide disculpas por los puntos malos del mismo e invita a la persona a comunicarse al email nombredelnegocio@gmail.com para que nos comente sus inquietudes, ofr??cele tambien un descuento en su proxima visita.",
          temperature: 0,
          max_tokens: 150,
          top_p: 1.0,
          frequency_penalty: 0.2,
          presence_penalty: 0.0,
        }),
      })
        .then((data) => data.json())
        .then((data) => setFeedbackResponse(data.choices[0].text));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.body.setAttribute("style", "margin-right: 0 !important");
    hotjar.initialize(process.env.NEXT_PUBLIC_HOTJARID, 1);
    if (hotjar.initialized()) {
      hotjar.identify("USER_ID", { userProperty: "value" });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h2 className={styles.main_h2}>Analiza tu Feedback</h2>
        <h4 className={styles.main_p}>
          Ingresa el comentario de un cliente para analizarlo
        </h4>
        <div className={styles.main_div}>
          <textarea
            value={feedback}
            className={styles.main_div_textarea}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Ingresa el comentario"
          />
          <button
            className={styles.main_div_button}
            disabled={loading}
            onClick={handleGenerateFeedbackAnalysis}
          >
            Analizar
          </button>
        </div>
        {feedbackAnalysis ? (
          <div className={styles.main_feedback_analysis}>
            <p className={styles.main_feedback_analysis_feedback}>
              "{feedback}"
            </p>
            <p className={styles.main_feedback_analysis_feedbackAnalysis}>
              {feedbackAnalysis}
            </p>
            <p
              className={styles.main_feedback_analysis_answer}
              onClick={handleGenerateFeedbackResponse}
            >
              Generar una respuesta al feedback
            </p>
          </div>
        ) : null}
        {feedbackResponse ? (
          <div className={styles.main_feedback_answer}>
            <p className={styles.main_feedback_answer_feedbackResponse}>
              {feedbackResponse}
            </p>
            <p
              className={styles.main_feedback_answer_copy}
              onClick={() => navigator.clipboard.writeText(feedbackResponse)}
            >
              Copiar al portapapeles
            </p>
          </div>
        ) : null}
        {loading ? (
          <img src={thinking.src} className={styles.main_img} />
        ) : null}
      </main>
    </>
  );
}
