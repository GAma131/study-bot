import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Modo Estudio Automático',
    description: (
      <>
        Envía preguntas de opción múltiple cada cierto tiempo con
        <code>/study [minutos]</code>. Configurable y persistente.
      </>
    ),
  },
  {
    title: 'Respuestas con Explicación',
    description: (
      <>
        Cada pregunta se revela con la respuesta correcta y una explicación
        detallada después de unos minutos.
      </>
    ),
  },
  {
    title: 'Almacenamiento en MongoDB',
    description: (
      <>
        Las preguntas se cargan desde MongoDB, permitiendo agregar contenido
        dinámicamente sin reiniciar el bot.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
