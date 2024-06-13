import styled from '@emotion/styled';

const FixedFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  color: white;
  background-color: #424242;
  text-align: center;
  padding: 0 10px;
  font: small-caps normal 13px/150% Roboto;
  left:0;
  bottom:0;
  right:0;
`;

const CenteredElement = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const Footer = () => {
    return (
        <FixedFooter>
            <p style={{ marginLeft: '10px' }}>
                Origone 151 | Chuquisaca | Malvinas Argentinas
            </p>

            <CenteredElement>
                <p>
                    UNAHUR
                </p>
            </CenteredElement>

            <p style={{ marginRight: '10px' }}>
                Contacto
            </p>
        </FixedFooter>
    )
}
