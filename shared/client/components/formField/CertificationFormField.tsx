import React from 'react';
import '@/shared/client/styled/formField/formField.css';
import { FormFields } from '../../../types/common';

const CertificationFormField = ({ label, placeholder, type, autoComplete, buttonText, loading, onChange, value, onClick}:FormFields) => {
    return (
        <div className='form-field-container'>
            <label className='label'>
                {label}<span style={{ color: "#FF4040" }}>*</span>
            </label>
            <div className='form-field-flex'>
                <input
                    className='form-field-input' 
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                />
                
                <button
                    style={{
                        cursor: loading ? "not-allowed" : "pointer",
                        pointerEvents: loading ? "none" : "auto" 
                    }} 
                    className='certification-button' 
                    onClick={onClick}
                >
                    {
                        loading ? 
                        (
                            <div className='dots'>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        ) :
                        (
                            buttonText
                        )
                    }
                </button>
            </div>
            <p style={{ color: "#FF4040", fontSize: '12px', height: '17px' }}><br /></p>
        </div>
    );
};

export default CertificationFormField;