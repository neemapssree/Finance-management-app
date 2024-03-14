
import { useState } from 'react';

const ValidationCheck = () => {
    const [errors, setErrors] = useState('');

    const validateForm = (tData) => {
        const validationErrors = {};
        console.log("tData:",tData.amount);

        function validateAmount (amountData) {
            const amountFormat = /^\d+$/;
            return amountFormat.test(amountData);
        }

        if (!tData.date || !tData.date.trim()) {
            validationErrors.date = "Date is required";
        }
        if (!tData.type || !tData.type.trim()) {
            validationErrors.type = "Type is required";
        }
        if(!tData.amount){
            validationErrors.amount = "Amount is required";
        }else if (tData.amount){
            const isValidAmount = validateAmount(tData.amount);
            if(!isValidAmount) {
                validationErrors.amount = "Amount must have numbers only";
            }
        }
        if(!tData.category || !tData.category.trim()){
            validationErrors.category = "Category is required";
        }
        // Add more validation rules here
        setErrors(validationErrors);
        return validationErrors;
    }

    return { errors, validateForm };
}

export default ValidationCheck;
