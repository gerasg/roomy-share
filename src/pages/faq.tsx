import Header from '../components/Header'
import { Accordion } from 'react-bootstrap'

export default function FAQ() {
  return (
    <div>
      <Header />
      <div className="container mt-4 mb-4">
        <h1>FAQ</h1>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>¿Cómo puedo reservar una habitación?</Accordion.Header>
              <Accordion.Body>
                Puedes reservar una habitación a través de nuestra plataforma en línea. Simplemente elige la habitación que te interesa y sigue las instrucciones para completar tu reserva.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>¿Qué incluye el precio de la renta?</Accordion.Header>
              <Accordion.Body>
                El precio de la renta incluye todas las facturas de servicios públicos, así como el acceso a todas las instalaciones compartidas de la casa.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>¿Hay reglas para vivir en la share house?</Accordion.Header>
              <Accordion.Body>
                Sí, tenemos algunas reglas básicas para garantizar un ambiente pacífico y amigable. Por ejemplo, esperamos que todos los residentes mantengan las áreas compartidas limpias y que sean respetuosos con los demás.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>¿Puedo usar la dirección de la casa compartida para registrarme en la ciudad?</Accordion.Header>
              <Accordion.Body>
                Sí, puedes utilizar la dirección de la casa compartida para tu registro en la ciudad. Es importante que verifiques los detalles con la administración local para garantizar el cumplimiento de todas las normativas.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>¿Cuánto equipaje puedo traer?</Accordion.Header>
              <Accordion.Body>
                Por lo general, puedes traer de 2 a 4 cajas de equipaje dependiendo del tamaño de tu espacio de cama. Si tienes más equipaje, por favor coordina con la administración ya que podríamos tener un espacio de almacenamiento disponible.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>¿Puedo recibir correos y paquetes en la casa compartida?</Accordion.Header>
              <Accordion.Body>
                Sí, puedes recibir correos y paquetes en la casa compartida. Por favor, asegúrate de que tu nombre esté claramente marcado en todos los envíos para evitar confusiones.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>¿Hay un toque de queda?</Accordion.Header>
              <Accordion.Body>
                No, no hay un toque de queda establecido. Sin embargo, pedimos a todos los residentes que sean respetuosos con los demás, especialmente durante las horas de la noche.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
              <Accordion.Header>¿Puedo extender mi estancia? ¿Cuánto costaría?</Accordion.Header>
              <Accordion.Body>
                Sí, puedes extender tu estancia en la casa compartida. El coste dependerá de la duración de la extensión. Por favor, comunícate con la administración para obtener detalles específicos.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header>¿Cuándo empieza el alquiler? ¿Puedo transferir el alquiler?</Accordion.Header>
              <Accordion.Body>
                El alquiler comienza el día en que te mudas a la casa compartida. Para detalles específicos sobre las transferencias de alquiler, por favor contacta a la administración.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="9">
              <Accordion.Header>¿Se permite fumar en la casa compartida?</Accordion.Header>
              <Accordion.Body>
                No, no se permite fumar en las áreas interiores de la casa compartida. Podría haber áreas designadas para fumar al aire libre.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="10">
              <Accordion.Header>¿Hay una secadora de pelo disponible?</Accordion.Header>
              <Accordion.Body>
                Sí, disponemos de secadoras de pelo en los baños compartidos. Por favor, úsalas de manera respetuosa y considerada.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="11">
              <Accordion.Header>¿Qué tipos de personas viven en la casa compartida?</Accordion.Header>
              <Accordion.Body>
                Nuestra casa compartida es hogar de una amplia variedad de personas, desde estudiantes hasta profesionales, tanto locales como internacionales. Estamos orgullosos de la diversidad y la comunidad inclusiva que hemos creado.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="12">
              <Accordion.Header>¿Hay aire acondicionado y calefacción? ¿Puede un residente ajustar la temperatura de la máquina?</Accordion.Header>
              <Accordion.Body>
                Sí, hay aire acondicionado y calefacción disponibles. La temperatura se ajusta para mantener un nivel de confort para todos los residentes, pero si tienes alguna inquietud sobre la temperatura, por favor comunícate con la administración.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="13">
              <Accordion.Header>¿Puedo usar la cocina? Quiero cocinar por mí mismo y ahorrar en costos de alimentos.</Accordion.Header>
              <Accordion.Body>
                Sí, todos los residentes tienen acceso a la cocina compartida. Pedimos que todos limpien después de cocinar para mantener un ambiente limpio y agradable para todos.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="14">
              <Accordion.Header>¿Hay dormitorios solo para mujeres?</Accordion.Header>
              <Accordion.Body>
                Sí, ofrecemos dormitorios separados para mujeres y hombres para garantizar la comodidad de todos nuestros residentes.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="15">
              <Accordion.Header>¿Quién limpia la casa/ habitación?</Accordion.Header>
              <Accordion.Body>
                El personal de limpieza realiza una limpieza regular de las áreas comunes. Sin embargo, se espera que los residentes mantengan limpias sus áreas personales y limpien después de usar las áreas compartidas.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
      </div>
    </div>
  )
}