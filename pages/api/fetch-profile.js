/* eslint-disable no-console */

export default async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    res.status(400).json({ message: 'Missing access token.' });
    return;
  }

  try {
    const response = await fetch(
      new URL(`${process.env.NEXT_PUBLIC_OAUTH_HOST}/api/user`),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const body = await response.json();
    if (body.error) {
      res.status(400).json(body);
    } else {
      res.status(200).json(body);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to fetch profile.' });
  }

  res.end();
};
