import Image from "next/image";

const LoaderSpin = () => {
  return (
    <>
    <Image
      src={"/assets/icons/loader.svg"}
      alt="loader"
      width={24}
      height={24}
      className="ml-2 animate-spin"
    />
    </>
  );
};

export default LoaderSpin;
