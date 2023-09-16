import Header from '../components/Header'
import { Accordion } from 'react-bootstrap'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function FAQ() {
  const { t } = useTranslation();
  return (
    <div>
      <Header />
      <div className="container mt-4 mb-4">
        <h1>FAQ</h1>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>{t('howToBook')}</Accordion.Header>
              <Accordion.Body>
              {t('bookOnline')}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>{t('priceIncludes')}</Accordion.Header>
              <Accordion.Body>
              {t('includedBills')}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>{t('houseRules')}</Accordion.Header>
              <Accordion.Body>
              {t('basicRules')}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>{t('canIRegister')}</Accordion.Header>
              <Accordion.Body>
              {t('registerYes')}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>{t('howMuchLuggage')}</Accordion.Header>
              <Accordion.Body>
              {t('luggage2to4')}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>{t('canIReceiveMail')}</Accordion.Header>
              <Accordion.Body>
              {t('mailYes')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>{t('isThereCurfew')}</Accordion.Header>
              <Accordion.Body>
              {t('noCurfew')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
              <Accordion.Header>{t('canIExtend')}</Accordion.Header>
              <Accordion.Body>
              {t('extendYes')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header>{t('whenDoesRentStart')}</Accordion.Header>
              <Accordion.Body>
              {t('rentStart')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="9">
              <Accordion.Header>{t('canSmoke')}</Accordion.Header>
              <Accordion.Body>
              {t('smokeNo')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="10">
              <Accordion.Header>{t('isHairDryer')}</Accordion.Header>
              <Accordion.Body>
              {t('hairDryerYes')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="11">
              <Accordion.Header>{t('whatPeople')}</Accordion.Header>
              <Accordion.Body>
              {t('diversePeople')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="12">
              <Accordion.Header>{t('ACAvailable')}</Accordion.Header>
              <Accordion.Body>
              {t('ACYes')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="13">
              <Accordion.Header>{t('canUseKitchen')}</Accordion.Header>
              <Accordion.Body>
              {t('kitchenYes')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="14">
              <Accordion.Header>{t('whoCleans')}</Accordion.Header>
              <Accordion.Body>
              {t('tenantCleans')}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
      </div>
    </div>
  )
}
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'footer']),
    },
  }
}