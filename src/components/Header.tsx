import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.eyebrow}>Paris, France</div>
        <h1 className={styles.title}>
          <span className={styles.titleMain}>Expositions</span>
          <span className={styles.titleSub}>Museums &amp; Galleries</span>
        </h1>
        <p className={styles.tagline}>
          Current &amp; upcoming shows across the city's finest institutions
        </p>
      </div>
      <div className={styles.rule} />
    </header>
  )
}
