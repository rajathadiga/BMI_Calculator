import { useState } from 'react';
import { motion } from 'framer-motion';
import FormSection from './components/FormSection';
import ResultSection from './components/ResultSection';
import ChatBot from './components/ChatBot';

function App() {
    const [results, setResults] = useState(null);

    return (
        <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
            <motion.h1 className="text-3xl font-bold mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                🧍 Health & Nutrition Advisor
            </motion.h1>

            <FormSection setResults={setResults} />

            {results && <ResultSection {...results} />}
            <ChatBot />
        </div>
    );
}

export default App;
