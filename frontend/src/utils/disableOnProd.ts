export const disableOnProd = () => {
  if (process.env.NODE_ENV === "development") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return { props: {} };
};