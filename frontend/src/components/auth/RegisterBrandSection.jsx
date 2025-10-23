const RegisterBrandSection = () => {
    const benefits = [
        { text: "Binlerce ücretsiz kurs" },
        { text: "Sertifika programları" },
        { text: "Uzman eğitmenler" },
        { text: "7/24 destek" }
    ];

    return (
        <div className="register-left">
            <div className="register-brand">
                <h1>Serudemy</h1>
                <p>Eğitim yolculuğunuza başlayın ve potansiyelinizi keşfedin</p>
            </div>
            
            <div className="register-benefits">
                {benefits.map((benefit, index) => (
                    <div key={index} className="benefit-item">
                        <div className="benefit-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <span className="benefit-text">{benefit.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegisterBrandSection;