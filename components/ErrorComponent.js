import { Typography } from '@material-ui/core';

export default function ErrorComponent() {
  return (
    <div style={{ margin: '30px', backgroundColor: '#55acee' }}>
      <Typography
        variant='h3'
        align='center'
        style={{
          backgroundColor: '#55acee',
        }}
      >
        Uh oh... Something is not working here.
      </Typography>
      <Typography variant='body1' align='center'>
        Please Check back later! You can let us know your order request through
        Instagram @daily.culture.kombucha or email us dailyculturekc@gmail.com.
      </Typography>
    </div>
  );
}
