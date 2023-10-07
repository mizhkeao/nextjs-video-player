import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import VideoPlayer from '../components/videoPlayer'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'

import Link from 'next/link'
import Date from '../components/date'

export async function getStaticProps() {
	const allPostsData = getSortedPostsData()
	return {
		props: {
			allPostsData,
		}
	}
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <h1>Hello!</h1>
        <p>
					Welcome to my website. :)
        </p>
			</section>

			<section>
				<VideoPlayer src='assets/React in 100 Seconds.mp4'></VideoPlayer>
			</section>

			<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
						<li className={utilStyles.listItem} key={id}>
							<Link href={`/posts/${id}`}>{title}</Link>
							<br />
							<small className={utilStyles.lightText}>
								<Date dateString={date} />
							</small>
						</li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}