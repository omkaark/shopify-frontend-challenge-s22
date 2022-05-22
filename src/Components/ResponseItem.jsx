import styles from "./ResponseItem.module.css";

const ResponseItem = ({ prompt, response }) => {
  return (
    <div className={styles.responseItem}>
      <h4>Prompt:</h4>
      <p>{prompt}</p>
      <h4>Response:</h4>
      <p>{response}</p>
    </div>
  );
};

export default ResponseItem;
