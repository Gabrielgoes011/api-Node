import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ModalConfirmacaoProps {
  mostrar: boolean;
  titulo: string;
  mensagem: string;
  textoBotaoConfirmar: string;
  textoBotaoCancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  mostrar,
  titulo,
  mensagem,
  textoBotaoConfirmar,
  textoBotaoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar
}) => {
  return (
    <Modal show={mostrar} onHide={onCancelar}>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{mensagem}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancelar}>
          {textoBotaoCancelar}
        </Button>
        <Button variant="primary" onClick={onConfirmar}>
          {textoBotaoConfirmar}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmacao;