import styles from "./WeekSelector.module.css";

export function WeekSelector() {
  const days = [
    { day: "M", date: "1" },
    { day: "T", date: "2" },
    { day: "W", date: "3", active: true },
    { day: "T", date: "4" },
    { day: "F", date: "5" },
    { day: "S", date: "6" },
    { day: "S", date: "7" }
  ];

  return (
    <div className={styles.weekSelector}>
      {days.map((item, index) => (
        <button
          key={index}
          className={`${styles.button} ${
            item.active ? styles.activeButton : styles.inactiveButton
          }`}
        >
          <span className={styles.day}>{item.day}</span>
          <span
            className={`${styles.date} ${
              item.active ? styles.activeDate : styles.inactiveDate
            }`}
          >
            {item.date}
          </span>
        </button>
      ))}
    </div>
  );
}