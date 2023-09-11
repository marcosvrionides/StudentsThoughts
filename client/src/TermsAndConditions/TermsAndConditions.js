import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
    return (
        <div className="terms-and-conditions">
            <h1 className="terms-and-conditions__title">Terms and Conditions</h1>
            <p className="terms-and-conditions__description">
                Please read these terms and conditions carefully before using our social media website. By using our site, you indicate that you accept these terms of use and that you agree to abide by them. If you do not agree to these terms, please do not use our site.
            </p>
            <section className="terms-and-conditions__section">
                <h2 className="terms-and-conditions__subtitle">Acceptable Use Policy</h2>
                <p className="terms-and-conditions__text">
                    Our website may only be used for lawful purposes. You may not use our site to post or transmit any content that is defamatory, obscene, threatening, or otherwise in violation of any laws.
                </p>
            </section>
            <section className="terms-and-conditions__section">
                <h2 className="terms-and-conditions__subtitle">User-Generated Content</h2>
                <p className="terms-and-conditions__text">
                    Any content that you post or transmit on our social media website becomes the property of the site. We may use and share this content in any manner we see fit, including for commercial purposes.
                </p>
            </section>
            <section className="terms-and-conditions__section">
                <h2 className="terms-and-conditions__subtitle">Data Privacy and Security</h2>
                <p className="terms-and-conditions__text">
                    We take the privacy and security of our users' data very seriously. Our site is built with appropriate measures to protect user data, including encryption and secure storage. However, we cannot guarantee that user data will not be hacked or otherwise compromised. By using our site, you acknowledge this risk and agree to not hold us accountable in the event of any harm that may result from the unauthorized use of your data.
                </p>
            </section>
            <section className="terms-and-conditions__section">
                <h2 className="terms-and-conditions__subtitle">Disclaimer of Liability</h2>
                <p className="terms-and-conditions__text">
                    We are not responsible for any harm that may result from the use of our social media website, including cyberbullying, identity theft, or any other damages. By using our site, you agree to not hold us accountable from any claims or damages that may result from your use of the site.
                </p>
            </section>
            <section className="terms-and-conditions__section">
                <h2 className="terms-and-conditions__subtitle">Changes to Terms and Conditions</h2>
                <p className="terms-and-conditions__text">
                    We reserve the right to change these terms and conditions at any time and without notice. Your continued use of our site following any changes indicates your acceptance of the new terms.
                </p>
            </section>
            <section className="terms-and-conditions__section">
                <h2 className="terms-and-conditions__subtitle">Governing Law</h2>
                <p className="terms-and-conditions__text">
                    These terms and conditions will be governed and interpreted in accordance with the laws of the country in which our website is based.
                </p>
            </section>
        </div>
    );
};

export default TermsAndConditions;

