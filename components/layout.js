import Header from './Header/Header';
import Footer from './Footer/Footer';
import HeaderLinks from './Header/HeaderLinks';

import Link from 'next/link';

const name = 'Hiit KC';
export const siteTitle = 'Hiit KC';

export default function Layout({ children, home }) {
  // const { ...rest } = props;

  return (
    <>
      <Header
        brand='Daily Culture'
        rightLinks={<HeaderLinks />}
        fixed
        color='transparent'
        changeColorOnScroll={{
          height: 200,
          color: 'white',
        }}
        // {...rest}
      />

      <main>{children}</main>
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
