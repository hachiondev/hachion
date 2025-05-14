package com.hachionUserDashboard.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.OfflinePaymentRequest;
import com.hachionUserDashboard.dto.OfflinePaymentResponse;
import com.hachionUserDashboard.entity.OfflinePayment;
import com.hachionUserDashboard.repository.OfflinePaymentRepository;

import Service.OfflinePaymentService;

@Service
public class OfflinePaymentServiceImpl implements OfflinePaymentService {

	@Autowired
	private OfflinePaymentRepository offlinePaymentRepository;

	@Override
	public OfflinePaymentResponse addOfflinePayment(OfflinePaymentRequest offlinePaymentRequest) {
		
		
		OfflinePayment offlinePayment = new OfflinePayment();
		offlinePayment.setStudentId(offlinePaymentRequest.getStudentId());
		offlinePayment.setStudentName(offlinePaymentRequest.getStudentName());
		offlinePayment.setEmail(offlinePaymentRequest.getEmail());
		offlinePayment.setMobile(offlinePaymentRequest.getMobile());
		offlinePayment.setCourseName(offlinePaymentRequest.getCourseName());
		offlinePayment.setCourseFee(offlinePaymentRequest.getCourseFee());
		offlinePayment.setTax(offlinePaymentRequest.getTax());
		offlinePayment.setDiscount(offlinePaymentRequest.getDiscount());
		offlinePayment.setNumberOfInstallements(offlinePaymentRequest.getNumberOfInstallements());
		offlinePayment.setNumberOfDays(offlinePaymentRequest.getNumberOfDays());
		offlinePayment.setPayDate(offlinePaymentRequest.getPayDate());
		offlinePayment.setDueDate(offlinePaymentRequest.getDueDate());
		offlinePayment.setPaymentMethod(offlinePaymentRequest.getPaymentMethod());
		offlinePayment.setInstallment(offlinePaymentRequest.getInstallment());
		offlinePayment.setActualPay(offlinePaymentRequest.getActualPay());
		offlinePayment.setReceived_pay(offlinePaymentRequest.getReceived_pay());
		offlinePayment.setProof(offlinePaymentRequest.getProof());
		offlinePayment.setReference(offlinePaymentRequest.getReference());
		offlinePayment.setTotalAmount(offlinePaymentRequest.getTotalAmount());
		offlinePayment.setBalancePay(offlinePaymentRequest.getBalancePay());

		offlinePayment = offlinePaymentRepository.save(offlinePayment);

		OfflinePaymentResponse response = new OfflinePaymentResponse();
		response.setOfflinePaymentId(offlinePayment.getOfflinePaymentId());
		response.setStudentId(offlinePayment.getStudentId());
		response.setStudentName(offlinePayment.getStudentName());
		response.setEmail(offlinePayment.getEmail());
		response.setMobile(offlinePayment.getMobile());
		response.setCourseName(offlinePayment.getCourseName());
		response.setCourseFee(offlinePayment.getCourseFee());
		response.setTax(offlinePayment.getTax());
		response.setDiscount(offlinePayment.getDiscount());
		response.setNumberOfInstallements(offlinePayment.getNumberOfInstallements());
		response.setNumberOfDays(offlinePayment.getNumberOfDays());
		response.setPayDate(offlinePayment.getPayDate());
		response.setDueDate(offlinePayment.getDueDate());
		response.setPaymentMethod(offlinePayment.getPaymentMethod());
		response.setInstallment(offlinePayment.getInstallment());
		response.setActualPay(offlinePayment.getActualPay());
		response.setReceived_pay(offlinePayment.getReceived_pay());
		response.setProof(offlinePayment.getProof());
		response.setReference(offlinePayment.getReference());
		response.setTotalAmount(offlinePayment.getTotalAmount());
		response.setBalancePay(offlinePayment.getBalancePay());

		return response;
	}

	@Override
	public OfflinePaymentResponse updateOfflinePayment(OfflinePaymentRequest offlinePaymentRequest) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<OfflinePaymentResponse> findByOfflineId(Long offlinePaymentId) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

	@Override
	public List<OfflinePaymentResponse> findAllOfflinePaymentdetails() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteByOfflineId(Long offlinePaymentId) {
		// TODO Auto-generated method stub

	}

}
