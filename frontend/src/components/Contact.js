import React from "react";

const Contact = () => {
    const teamMembers = [
        { name: "Chenyang Li", email: "cli049@uottawa.ca" },
        { name: "Xinye Zhu", email: "xzhu019@uottawa.ca" },
        { name: "Pouria Bahri", email: "pbahr076@uottawa.ca" },
        { name: "Mingzhao Yu", email: "myu058@uottawa.ca" },
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Contact Us</h1>
            <ul style={styles.list}>
                {teamMembers.map((member, index) => (
                    <li key={index} style={styles.card}>
                        <h2 style={styles.name}>{member.name}</h2>
                        <p style={styles.email}>
                            Email: <a href={`mailto:${member.email}`}>{member.email}</a>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
    },
    header: {
        color: "#333",
        marginBottom: "20px",
    },
    list: {
        listStyleType: "none",
        padding: 0,
    },
    card: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        marginBottom: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    name: {
        fontSize: "18px",
        color: "#444",
    },
    email: {
        fontSize: "16px",
        color: "#555",
    },
};

export default Contact;
