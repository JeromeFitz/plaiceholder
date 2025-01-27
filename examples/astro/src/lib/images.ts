import glob from "tiny-glob";

export const getAllPublicUnsplashImagePaths = async () => {
  const paths = await glob("./public/assets/images/unsplash/*.{jpg,png}").then(
    (files) =>
      files.map((file) => {
        const sep = "/";
        const fileArr = file.split(sep);

        const filePath = fileArr
          .slice(fileArr.indexOf("public") + 1, fileArr.length)
          .join(sep);

        return [sep, filePath].join("");
      })
  );

  return paths;
};
