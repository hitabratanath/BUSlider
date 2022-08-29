import * as React from 'react'
import { getSP } from '../../../pnpjs-config'
import "@pnp/sp/fields";
import "@pnp/sp/views";
import { FieldTypes } from '@pnp/sp/fields';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import styles from './InsightCarousel.module.scss';
import { FadeLoader } from 'react-spinners';

const InsightCarousel = ({ list, imageCount }) => {
  const sp = getSP()
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (list !== undefined) {
      sp.web.lists.ensure(list).then(createList => {
        if (createList.created) {
          setLoading(true)
          console.log('list created successfull!!');
          createColumns().then(() => {
            console.log('columns created successfully!!');
            createView().then(() => {
              console.log('view added successfully!!')
              setLoading(false)
            })
          })
        }
        else {
          console.log('list is already there!!');
          sp.web.lists.getByTitle(list).items
            .select('Title', 'ImageLink', 'NavigationLink', 'Page', 'IsActive', 'SortOrder', 'Description')
            .filter("IsActive eq 1")
            .orderBy('SortOrder').top(imageCount)()
            .then(resp => setData(resp))
        }
      }).catch(err => console.log(err))
    }
  }, [list, imageCount])
  console.log(data)
  async function createColumns() {
    await sp.web.lists.getByTitle(list).fields.addText('ImageLink')
    await sp.web.lists.getByTitle(list).fields.addText('NavigationLink')
    await sp.web.lists.getByTitle(list).fields.addText('Page')
    await sp.web.lists.getByTitle(list).fields.addBoolean('IsActive')
    await sp.web.lists.getByTitle(list).fields.addNumber('SortOrder')
    await sp.web.lists.getByTitle(list).fields.addText('Description')
  }
  async function createView() {
    await sp.web.lists.getByTitle(list).views.getByTitle('All Items').fields.add('ImageLink')
    await sp.web.lists.getByTitle(list).views.getByTitle('All Items').fields.add('NavigationLink')
    await sp.web.lists.getByTitle(list).views.getByTitle('All Items').fields.add('Page')
    await sp.web.lists.getByTitle(list).views.getByTitle('All Items').fields.add('IsActive')
    await sp.web.lists.getByTitle(list).views.getByTitle('All Items').fields.add('SortOrder')
    await sp.web.lists.getByTitle(list).views.getByTitle('All Items').fields.add('Description')
  }
  function handleClick(index) {
    window.open(data[index].NavigationLink, '_blank')
  }
  return (
    <div className={styles.slide}>
      <div className={styles.spinner}>
        <FadeLoader
          color="#017bfe"
          loading={loading}
          speedMultiplier={1}
        />
      </div>
      <Carousel showThumbs={false} showStatus={false} onClickItem={handleClick} infiniteLoop={true} autoPlay={true}>
        {data.length && data.map(item => <div style={{ backgroundImage: `url('${item.ImageLink}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', height: '50vh' }}></div>)}
      </Carousel>
    </div>
  )
}

export default InsightCarousel