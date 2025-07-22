import os
import openai
import streamlit as st
from dotenv import load_dotenv

# Load GROQ API
load_dotenv()
openai.api_key = os.getenv("GROQ_API_KEY")
openai.api_base = "https://api.groq.com/openai/v1"

# --- Calculation Functions ---


def calculate_bmi(weight_kg, height_cm):
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 2)


def get_bmi_category(bmi):
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal weight"
    elif bmi < 30:
        return "Overweight"
    return "Obese"


def calculate_bmr(weight_kg, height_cm, age, gender):
    if gender == 'male':
        return round(10 * weight_kg + 6.25 * height_cm - 5 * age + 5, 2)
    elif gender == 'female':
        return round(10 * weight_kg + 6.25 * height_cm - 5 * age - 161, 2)
    raise ValueError("Gender must be 'male' or 'female'")


def calculate_tdee(bmr, activity_level):
    activity_factors = {
        'Sedentary': 1.2,
        'Light': 1.375,
        'Moderate': 1.55,
        'Active': 1.725,
        'Very Active': 1.9
    }
    return round(bmr * activity_factors.get(activity_level, 1.2), 2)


def calculate_macros(tdee):
    protein_cal = 0.3 * tdee
    fat_cal = 0.25 * tdee
    carbs_cal = tdee - protein_cal - fat_cal
    return {
        'Protein (g)': round(protein_cal / 4),
        'Fat (g)': round(fat_cal / 9),
        'Carbohydrates (g)': round(carbs_cal / 4)
    }


# --- Streamlit UI ---
st.set_page_config(
    page_title="🧠 Health & Nutrition Advisor", layout="centered")
st.title("🥗 Health & Nutrition Advisor")

with st.form("health_form"):
    st.subheader("📋 Enter Your Details")
    age = st.number_input("Age", min_value=1, max_value=120, step=1)
    gender = st.selectbox("Gender", ["male", "female"])
    height_cm = st.number_input("Height (cm)", min_value=50.0, max_value=250.0)
    weight_kg = st.number_input("Weight (kg)", min_value=10.0, max_value=300.0)
    activity_level = st.selectbox(
        "Activity Level", ["Sedentary", "Light", "Moderate", "Active", "Very Active"])
    submitted = st.form_submit_button("Calculate")

if submitted:
    bmi = calculate_bmi(weight_kg, height_cm)
    bmi_cat = get_bmi_category(bmi)
    bmr = calculate_bmr(weight_kg, height_cm, age, gender)
    tdee = calculate_tdee(bmr, activity_level)
    macros = calculate_macros(tdee)

    st.success("✅ Health Summary Calculated")
    st.metric("BMI", bmi, bmi_cat)
    st.metric("BMR (kcal/day)", bmr)
    st.metric("TDEE (kcal/day)", tdee)

    st.subheader("🍽️ Suggested Daily Macros")
    st.write(macros)

    st.subheader("💡 Nutrition Advice")
    if bmi_cat == "Underweight":
        st.info(
            "You are underweight. Increase calorie intake with nutrient-rich foods.")
    elif bmi_cat == "Normal weight":
        st.success(
            "You have a healthy weight. Maintain it with balanced meals and activity.")
    elif bmi_cat == "Overweight":
        st.warning(
            "You are overweight. Consider mild calorie deficit and more physical activity.")
    else:
        st.error("You are obese. It's advisable to consult a doctor or dietitian.")

    if st.button("📞 Contact Nutritionist"):
        st.markdown("""
        📧 **Email**: contact@nutritionist.ai  
        📱 **Phone**: +91 98765 43210  
        🌐 **Website**: [www.nutritionist.ai](http://www.nutritionist.ai)
        """)

# --- AI Chatbot Section ---
st.markdown("---")
st.subheader("🤖 Ask the Nutrition AI")
user_question = st.text_input("Ask a food or health-related question")

if user_question:
    try:
        response = openai.ChatCompletion.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful and smart nutrition advisor. Answer questions clearly and scientifically."},
                {"role": "user", "content": user_question}
            ]
        )
        reply = response['choices'][0]['message']['content']
        st.markdown(f"**AI Response:** {reply}")
    except Exception as e:
        st.error(f"AI error: {e}")
