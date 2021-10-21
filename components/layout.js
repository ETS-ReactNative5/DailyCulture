import Header from './Header/Header';
import Footer from './Footer/Footer';
import HeaderLinks from './Header/HeaderLinks';

import Link from 'next/link';

export default function Layout({ children, home }) {
  // const { ...rest } = props;

  return (
    <>
      <Header
        brand='Daily Culture'
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: 'white',
        }}
        // {...rest}
      />

      <main style={{ marginTop: '80px' }}>{children}</main>
      <Footer />
      {/* {!home && (
        <div className={styles.backToHome}>
          <Link href='/'>
            <a>← Back to home</a>
          </Link>
        </div>
      )} */}
    </>
  );
}
