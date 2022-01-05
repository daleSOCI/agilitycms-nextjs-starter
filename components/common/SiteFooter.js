import React from "react";

const SiteFooter = ({ globalData }) => {

  const { copyright } = globalData.footer;

  return (
    <footer>
      {copyright && <p>{copyright}</p>}
    </footer>
  );
};

SiteFooter.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  // set up api
  const api = agility;

  // set up content item
  let contentItem = null;

  try {
    // try to fetch our site footer
    let footer = await api.getContentList({
      referenceName: "footer",
      languageCode: languageCode,
      take: 1
    });

    // if we have a footer, set as content item
    if (footer && footer.items && footer.items.length > 0) {
      contentItem = footer.items[0];

      // else return null
    } else {
      return null;
    }
  } catch (error) {
    if (console) console.error("Could not load site footer item.", error);
    return null;
  }

  // return clean object...
  return {
    copyright: contentItem.fields.copyright
  };
};

export default SiteFooter;
