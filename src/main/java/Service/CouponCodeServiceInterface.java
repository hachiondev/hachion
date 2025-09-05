package Service;

import java.util.List;
import java.util.Map;

import com.hachionUserDashboard.dto.CouponCodeRequest;
import com.hachionUserDashboard.dto.CouponCodeResponse;

public interface CouponCodeServiceInterface {

	public CouponCodeResponse createCouponCode(CouponCodeRequest couponCodeRequest);

	public CouponCodeResponse updateCouponCode(CouponCodeRequest couponCodeRequest);

	public void deleteCouponCode(Long couponId);

	public List<CouponCodeResponse> getAlCouponCodeDetails();

//	public List<Object[]> getDiscountByCouponCode(String couponCode);
	public Map<String, Object> getDiscountByCouponCode(String couponCode);
}
