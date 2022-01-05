import React, { useState } from "react";
import Link from "next/link";
import head from "next/head";

const SiteHeader = ({ globalData, sitemapNode, page }) => {
  // get header data
  const { logo } = globalData.header;

  // open / close mobile nav
  const [open, setOpen] = useState(false);

  return (
    <header>
      {logo && <img src={logo.url} alt="" />}
    </header>
  );
};

SiteHeader.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  // set up api
  const api = agility;

  // set up content item
  let contentItem = null;

  try {
    // try to fetch our site header
    let header = await api.getContentList({
      referenceName: "header",
      languageCode: languageCode,
      take: 1
    });

    // if we have a header, set as content item
    if (header && header.items && header.items.length > 0) {
      contentItem = header.items[0];

      // else return null
    } else {
      return null;
    }
  } catch (error) {
    if (console) console.error("Could not load site header item.", error);
    return null;
  }

  // return clean object...
  return {
    logo: contentItem.fields.logo
  };
};

export default SiteHeader;
