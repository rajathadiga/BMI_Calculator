export default function ResultSection({ bmi, bmr, tdee, bmiCategory, macros }) {
    return (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">📊 Results</h2>
            <p><strong>BMI:</strong> {bmi} ({bmiCategory})</p>
            <p><strong>BMR:</strong> {bmr} kcal/day</p>
            <p><strong>TDEE:</strong> {tdee} kcal/day</p>
            <p className="mt-4 font-semibold">Daily Macros:</p>
            <ul className="list-disc ml-6">
                <li>Protein: {macros.protein}g</li>
                <li>Fat: {macros.fat}g</li>
                <li>Carbohydrates: {macros.carbs}g</li>
            </ul>
        </div>
    );
}
