import { useState } from "react";
import { Header, Refresh } from "@/components";
import { motion } from "framer-motion";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="page-framer">
      <Header title="动画"></Header>

      <main>
        <Refresh onClick={() => setCount(count + 1)} />

        <div className="card" key={count + 1}>
          <motion.div animate={{ scale: 1.2 }} />
        </div>
        <div className="card" key={count + 2}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2 }} />
        </div>
        <div className="card" key={count + 3}>
          <motion.div
            animate={{
              scale: [1, 2, 2, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
          />
        </div>
        <div className="card" key={count + 4}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </div>
      </main>
    </div>
  );
}
