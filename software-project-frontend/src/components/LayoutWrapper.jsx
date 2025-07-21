// LayoutWrapper.jsx
export default function LayoutWrapper({ children }) {
    return (
      <div
        style={{
          backgroundColor: "#001f3f",
          minHeight: "100vh",
          padding: "2rem",
          color: "white",
        }}
      >
        {children}
      </div>
    );
  }
  