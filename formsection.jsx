import { useState } from 'react';

const calculateBMI = (w, h) => +(w / ((h / 100) ** 2)).toFixed(2);
const getCategory = (bmi) => bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
const calcBMR = (w, h, age, g) =>
    g === "male" ? +(10 * w + 6.25 * h - 5 * age + 5).toFixed(2) : +(10 * w + 6.25 * h - 5 * age - 161).toFixed(2);
const calcTDEE = (bmr, activity) => {
    const levels = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, 'very active': 1.9 };
    return +(bmr * (levels[activity] || 1.2)).toFixed(2);
};
const calcMacros = (tdee) => ({
    protein: Math.round((0.3 * tdee) / 4),
    fat: Math.round((0.25 * tdee) / 9),
    carbs: Math.round((0.45 * tdee) / 4)
});

export default function FormSection({ setResults }) {
    const [form, setForm] = useState({ age: '', gender: '', height: '', weight: '', activity: 'moderate' });

    const handleSubmit = (e) => {
        e.preventDefault();
        const { age, gender, height, weight, activity } = form;
        const bmi = calculateBMI(weight, height);
        const bmr = calcBMR(weight, height, age, gender);
        const tdee = calcTDEE(bmr, activity);
        const macros = calcMacros(tdee);

        setResults({ bmi, bmr, tdee, bmiCategory: getCategory(bmi), macros });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 bg-white p-6 rounded-xl shadow-md">
            <div className="grid gap-2">
                <input type="number" placeholder="Age" required value={form.age} onChange={e => setForm({ ...form, age: +e.target.value })} />
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input type="number" placeholder="Height (cm)" required value={form.height} onChange={e => setForm({ ...form, height: +e.target.value })} />
                <input type="number" placeholder="Weight (kg)" required value={form.weight} onChange={e => setForm({ ...form, weight: +e.target.value })} />
                <select value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })}>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very active">Very Active</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-xl">Calculate</button>
        </form>
    );
}
