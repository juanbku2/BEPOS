import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../api/axios';
import { User } from '../types/User';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const UserComponent = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [form, setForm] = useState<User>({ id: 0, username: '', firstName: '', lastName: '', email: '', role: 'USER', password: '' });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('/api/v1/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/api/v1/users/${form.id}` : '/api/v1/users';

    axios[method](url, form)
      .then(() => {
        fetchUsers();
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error saving user:', error);
      });
  };

  const handleEdit = (user: User) => {
    setForm(user);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    axios.delete(`/api/v1/users/${id}`)
      .then(() => {
        fetchUsers();
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handleNew = () => {
    setForm({ id: 0, username: '', firstName: '', lastName: '', email: '', role: 'USER', password: '' });
    setShowModal(true);
  };
  
  const handleChangePassword = () => {
    axios.put(`/api/v1/users/${form.id}/password`, { newPassword: newPassword })
      .then(() => {
        setShowChangePasswordModal(false);
        setNewPassword('');
      })
      .catch(error => {
        console.error('Error changing password:', error);
      });
  };

  return (
    <div>
      <Button variant="primary" onClick={handleNew} className="mb-3">
        {t('user.newUser')} {/* Translate New User */}
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('user.usernameHeader')}</th> {/* Translate Username */}
            <th>{t('user.firstNameHeader')}</th> {/* Translate First Name */}
            <th>{t('user.lastNameHeader')}</th> {/* Translate Last Name */}
            <th>{t('user.emailHeader')}</th> {/* Translate Email */}
            <th>{t('user.roleHeader')}</th> {/* Translate Role */}
            <th>{t('user.actionsHeader')}</th> {/* Translate Actions */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(user)} className="me-2">
                  {t('user.editButton')} {/* Translate Edit */}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  {t('user.deleteButton')} {/* Translate Delete */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t(form.id ? 'user.editUser' : 'user.newUser')}</Modal.Title> {/* Translate Edit/New User */}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t('user.usernameLabel')}</Form.Label> {/* Translate Username */}
              <Form.Control type="text" name="username" value={form.username} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('user.firstNameLabel')}</Form.Label> {/* Translate First Name */}
              <Form.Control type="text" name="firstName" value={form.firstName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('user.lastNameLabel')}</Form.Label> {/* Translate Last Name */}
              <Form.Control type="text" name="lastName" value={form.lastName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('user.emailLabel')}</Form.Label> {/* Translate Email */}
              <Form.Control type="email" name="email" value={form.email} onChange={handleInputChange} />
            </Form.Group>
            {!form.id && (
              <Form.Group>
                <Form.Label>{t('user.passwordLabel')}</Form.Label> {/* Translate Password */}
                <Form.Control type="password" name="password" value={form.password} onChange={handleInputChange} />
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label>{t('user.roleLabel')}</Form.Label> {/* Translate Role */}
              <Form.Select name="role" value={form.role} onChange={handleSelectChange}>
                <option value="USER">{t('user.roleUser')}</option> {/* Translate User Role */}
                <option value="ADMIN">{t('user.roleAdmin')}</option> {/* Translate Admin Role */}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {form.id && (
            <Button variant="info" onClick={() => setShowChangePasswordModal(true)}>
              {t('user.changePasswordButton')} {/* Translate Change Password */}
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('user.closeButton')} {/* Translate Close */}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {t('user.saveChangesButton')} {/* Translate Save Changes */}
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('user.changePasswordModalTitle')}</Modal.Title> {/* Translate Change Password Modal Title */}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t('user.newPasswordLabel')}</Form.Label> {/* Translate New Password */}
              <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChangePasswordModal(false)}>
            {t('user.closeButton')} {/* Translate Close */}
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            {t('user.saveChangesButton')} {/* Translate Save Changes */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserComponent;
