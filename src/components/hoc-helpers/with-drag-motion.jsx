import { motion } from "framer-motion";

const WithDragMotion = (props) => {
  const { innerWidth: width, innerHeight: height } = window;
  const dragBorders = {
    left: -width / 2,
    right: width / 2,
    top: -height / 2,
    bottom: height / 2,
  };
  return (
    <motion.span
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        zIndex: 1,
      }}
      drag
      dragConstraints={dragBorders}
      whileDrag={{ scale: 1.02 }}
      transition={{ type: "spring", duration: 1 }}
    >
      {props.children}
    </motion.span>
  );
};

export default WithDragMotion;
