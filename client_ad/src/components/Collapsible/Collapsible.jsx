import React, { useState } from 'react';
import styles from './Collapsible.module.css';

const Collapsible = (props) => {
    const [shown, setShown] = useState(false);

    const handleClick = () => {
        setShown(!shown);
    }

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <p className={styles.pHead}>{props.heading}</p>
                <p className={styles.trigger} onClick={handleClick}>{shown ? 'Collapse' : 'Expand'}</p>
            </div>
            <div className={`${styles.body} ${shown ? styles.show : styles.hide}`}>
                {props.children}
            </div>
        </div>
    );
}

export default Collapsible;

