import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30
  },
  scrollView: {
    flex: 1,
  },
  formWrapper: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 16,
  },
  formContainer: {
    backgroundColor: 'rgba(243, 232, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(244, 114, 182, 0.5)',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  radioGroup: {
    marginTop: 6,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F472B6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#F472B6',
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
  },
  nextButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(253, 230, 248, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 8,
  },
  instructionsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  instructionsText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  instructionsHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  bulletPoints: {
    paddingLeft: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default styles; 