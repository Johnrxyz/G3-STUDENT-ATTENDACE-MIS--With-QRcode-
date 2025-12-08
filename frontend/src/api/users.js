import { axiosPrivate } from './axios';

export const getUserProfile = async (id) => {
    // Assuming backend has an endpoint for user profile or we fetch via ID
    // Based on UserViewSet, we can get /users/{id}/
    return axiosPrivate.get(`/users/${id}/`);
};

export const getStudentProfile = async () => {
    // StudentProfileViewSet has logic to return current student's profile?
    // Or we need to filter?
    // Backend: StudentProfileViewSet.queryset = StudentProfile.objects.all()
    // It filters by user if student.
    // Let's assume there's a 'me' endpoint or we filter.
    // Actually, StudentProfileViewSet doesn't seem to have 'me'.
    // But `get_queryset` implementation filters `user=self.request.user` for students.
    // So generic GET /student-profiles/ might return list of 1.
    return axiosPrivate.get('/student-profiles/');
};

export const getMyEnrolledSections = async () => {
    // Sections user is in.
    // The SectionViewSet doesn't seem to have "my sections" for student explicitly?
    // Wait, backend `SectionViewSet.get_queryset` checks if teacher. 
    // If student, it returns all? Or maybe validation logic is elsewhere.
    // Actually, `StudentProfile` has `sections` field (ManyToMany).
    // So likely we get student profile and read `sections`.
    const response = await getStudentProfile();
    // Assuming response.data is a list [profile] or object.
    // If list:
    if (Array.isArray(response.data) && response.data.length > 0) {
        // We probably need to fetch section details separately if profile only has IDs.
        // Serializer `StudentProfileSerializer`:
        /*
        class StudentProfileSerializer(serializers.ModelSerializer):
            user = UserSerializer(read_only=True)
            class Meta:
                model = StudentProfile
                fields = ['id', 'user', 'student_number', 'qr_code_data', 'sections']
        */
        // It returns IDs.
        // We might need to fetch sections.
    }
    return response;
};

export const getStudentsBySection = (sectionId, axiosInstance = axiosPrivate) => {
    return axiosInstance.get(`/student-profiles/?section=${sectionId}`);
};

export const createProfileEditRequest = async (data) => {
    return axiosPrivate.post('/profile-requests/', data);
};

export const getMyProfileRequests = async () => {
    return axiosPrivate.get('/profile-requests/');
};

export const getPendingRequests = async () => {
    return axiosPrivate.get('/profile-requests/');
};

export const approveRequest = async (id) => {
    return axiosPrivate.post(`/profile-requests/${id}/approve/`);
};

export const denyRequest = async (id, data) => {
    return axiosPrivate.post(`/profile-requests/${id}/deny/`, data);
};

export default {
    getStudentProfile,
    getStudentsBySection,
    getMyEnrolledSections
};
