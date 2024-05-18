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
                    UNaHur
                </p>
            </CenteredElement>

            <p style={{ marginRight: '10px' }}>
                Contacto
            </p>
        </FixedFooter>
    )
}
