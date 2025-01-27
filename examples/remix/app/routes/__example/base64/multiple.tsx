import {
  json,
  type HeadersFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { cx } from "class-variance-authority";
import { imageList, imageListItem } from "@plaiceholder/ui";
import {
  getPlaiceholder,
  type IGetPlaiceholderReturn,
} from "~/modules/plaiceholder.server";
import { config } from "~/config";

interface LoaderData {
  images: (Pick<IGetPlaiceholderReturn, "base64" | "img"> & {
    alt: string;
    title: string;
  })[];
}

export const headers: HeadersFunction = () => ({
  "Cache-Control": config["Cache-Control"],
});

export const loader: LoaderFunction = async () => {
  const images = await Promise.all(
    config.examples.variants.multiple.unsplash.map(async (src) => {
      const { base64, img } = await getPlaiceholder(src);

      return {
        alt: "Paint Splashes",
        title: "Photo from Unsplash",
        base64,
        img,
      };
    })
  ).then((values) => values);

  return json<LoaderData>({
    images,
  });
};

export default function Base64Multiple() {
  const { images } = useLoaderData<LoaderData>();

  return (
    <ul className={imageList({ columns: 3, aspect: "5/7" })}>
      {images.map(({ alt, base64, img, title }) => (
        <li key={img.src} className={imageListItem()}>
          <img
            aria-hidden
            alt=""
            src={base64}
            className={cx(
              "absolute",
              "inset-0",
              "w-full",
              "h-full",
              "transform",
              "scale-150",
              "filter",
              "blur-2xl",
              "z-[-1]"
            )}
          />
          <img className="text-transparent" alt={alt} title={title} {...img} />
        </li>
      ))}
    </ul>
  );
}
