PATIENT_PAYLOAD = {
    "first_name": "Alice",
    "last_name": "Johnson",
    "date_of_birth": "1985-03-15",
    "email": "alice@example.com",
    "phone": "(555) 555-0101",
    "gender": "female",
    "blood_type": "A+",
}


def test_list_patients_empty(client):
    response = client.get("/patients")
    assert response.status_code == 200
    assert response.json() == []


def test_create_patient(client):
    response = client.post("/patients", json=PATIENT_PAYLOAD)
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Alice"
    assert data["email"] == "alice@example.com"
    assert data["blood_type"] == "A+"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_patient_invalid_blood_type(client):
    payload = {**PATIENT_PAYLOAD, "blood_type": "Z+"}
    response = client.post("/patients", json=payload)
    assert response.status_code == 422


def test_get_patient(client):
    create_response = client.post("/patients", json=PATIENT_PAYLOAD)
    patient_id = create_response.json()["id"]

    response = client.get(f"/patients/{patient_id}")
    assert response.status_code == 200
    assert response.json()["email"] == "alice@example.com"


def test_get_patient_not_found(client):
    response = client.get("/patients/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Patient not found"


def test_update_patient(client):
    create_response = client.post("/patients", json=PATIENT_PAYLOAD)
    patient_id = create_response.json()["id"]

    response = client.put(f"/patients/{patient_id}", json={"first_name": "Alicia"})
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Alicia"
    assert data["last_name"] == "Johnson"  # unchanged
    assert data["email"] == "alice@example.com"  # unchanged


def test_update_patient_not_found(client):
    response = client.put("/patients/999", json={"first_name": "Ghost"})
    assert response.status_code == 404


def test_delete_patient(client):
    create_response = client.post("/patients", json=PATIENT_PAYLOAD)
    patient_id = create_response.json()["id"]

    response = client.delete(f"/patients/{patient_id}")
    assert response.status_code == 204

    response = client.get(f"/patients/{patient_id}")
    assert response.status_code == 404


def test_delete_patient_not_found(client):
    response = client.delete("/patients/999")
    assert response.status_code == 404


def test_list_patients_returns_all(client):
    payloads = [
        {**PATIENT_PAYLOAD, "email": "p1@example.com"},
        {**PATIENT_PAYLOAD, "email": "p2@example.com"},
    ]
    for p in payloads:
        client.post("/patients", json=p)

    response = client.get("/patients")
    assert response.status_code == 200
    assert len(response.json()) == 2
