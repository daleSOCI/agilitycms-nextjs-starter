import FormData from 'form-data';

/* eslint-disable no-console */

export default async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400).json({ message: 'Missing code parameter in body.' });
    return;
  }

  const formData = new FormData();
  formData.append('grant_type', 'authorization_code');
  formData.append('code', code);

  try {
    const response = await fetch(
      new URL(`${process.env.NEXT_PUBLIC_OAUTH_HOST}/oauth/token`),
      {
        method: 'POST',
        headers: {
          Authorization: process.env.OAUTH_AUTHORIZATION_HASH,
        },
        body: formData,
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
    res.status(400).json({ message: 'Authentication failed.' });
  }

  res.end();
};
